import os
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Custom PostgreSQL database shell'

    def handle(self, *args, **options):
        db = settings.DATABASES['default']
        # Use absolute path to psql executable
        command = f"/opt/homebrew/opt/postgresql@15/bin/psql 'dbname={db['NAME']} user={db['USER']} password={db['PASSWORD']} host={db['HOST']}'"
        self.stdout.write(f"Running: {command}")
        os.system(command)