# Generated by Django 4.2 on 2023-06-02 20:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_account_options_alter_ticket_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='account',
            options={'managed': False, 'ordering': ['id_account']},
        ),
        migrations.AlterModelOptions(
            name='ticket',
            options={'managed': False, 'ordering': ['id']},
        ),
    ]
