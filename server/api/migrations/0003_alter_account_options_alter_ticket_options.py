# Generated by Django 4.2 on 2023-06-02 20:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_account_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='account',
            options={'ordering': ['id_account']},
        ),
        migrations.AlterModelOptions(
            name='ticket',
            options={'ordering': ['id']},
        ),
    ]
