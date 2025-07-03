from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser, Restaurant, Category, Dish

class SuperAdminLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))

class RestaurantAdminLoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control', 'placeholder': 'Password'}))

class RestaurantForm(forms.ModelForm):
    class Meta:
        model = Restaurant
        fields = ['name', 'address', 'phone']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Restaurant Name'}),
            'address': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Address', 'rows': 3}),
            'phone': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Phone Number'}),
        }

class RestaurantAdminCreationForm(UserCreationForm):
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'First Name'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Last Name'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control', 'placeholder': 'Email'}))
    
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Username'}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Password'})
        self.fields['password2'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Confirm Password'})

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'order']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Category Name'}),
            'order': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Display Order'}),
        }

class DishForm(forms.ModelForm):
    # Add a multiple select field for categories
    additional_categories = forms.ModelMultipleChoiceField(
        queryset=Category.objects.none(),
        required=False,
        widget=forms.SelectMultiple(attrs={'class': 'form-select', 'size': '5'}),
        help_text="Hold Ctrl (or Command on Mac) to select multiple categories"
    )
    
    class Meta:
        model = Dish
        fields = ['name', 'description', 'price', 'serves', 'image', 'is_available', 'is_vegetarian', 'category', 
                 'additional_categories', 'has_3d_model', 'glb_file', 'usdz_file']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Dish Name'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'placeholder': 'Description', 'rows': 3}),
            'price': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Price', 'step': '0.01'}),
            'serves': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Serves (e.g., "Serves 2-3")'}),
            'is_available': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
            'is_vegetarian': forms.RadioSelect(attrs={'class': 'form-check-input'}),
            'category': forms.Select(attrs={'class': 'form-select'}),
            'has_3d_model': forms.CheckboxInput(attrs={'class': 'form-check-input', 'id': 'has_3d_model'}),
            'glb_file': forms.FileInput(attrs={'class': 'form-control', 'accept': '.glb'}),
            'usdz_file': forms.FileInput(attrs={'class': 'form-control', 'accept': '.usdz'}),
        }
    
    def __init__(self, restaurant=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if restaurant:
            self.fields['category'].queryset = Category.objects.filter(restaurant=restaurant)
            self.fields['additional_categories'].queryset = Category.objects.filter(restaurant=restaurant)
            
            # If this is an existing dish, initialize the additional_categories and is_vegetarian fields
            if self.instance.pk:
                self.initial['additional_categories'] = self.instance.categories.all().exclude(id=self.instance.category.id)
                # Properly initialize the is_vegetarian field
                self.initial['is_vegetarian'] = self.instance.is_vegetarian
            
    def clean_glb_file(self):
        glb_file = self.cleaned_data.get('glb_file')
        has_3d_model = self.cleaned_data.get('has_3d_model')
        
        if has_3d_model and not glb_file and not self.instance.glb_file:
            raise forms.ValidationError("Please upload a GLB file for 3D model.")
            
        if glb_file and not glb_file.name.endswith('.glb'):
            raise forms.ValidationError("Only GLB files are allowed.")
            
        return glb_file
        
    def clean_usdz_file(self):
        usdz_file = self.cleaned_data.get('usdz_file')
        has_3d_model = self.cleaned_data.get('has_3d_model')
        
        if has_3d_model and not usdz_file and not self.instance.usdz_file:
            raise forms.ValidationError("Please upload a USDZ file for 3D model.")
            
        if usdz_file and not usdz_file.name.endswith('.usdz'):
            raise forms.ValidationError("Only USDZ files are allowed.")
            
        return usdz_file