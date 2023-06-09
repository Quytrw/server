from django.db import models

class Account(models.Model):
    account_id = models.AutoField(db_column='AccountId', primary_key=True)
    email = models.CharField(db_column='Email', unique=True, max_length=50)
    password = models.CharField(db_column='Password', max_length=50)
    name = models.CharField(db_column='Name', db_collation='utf8mb4_bin', max_length=50)
    license = models.CharField(db_column='License', unique=True, max_length=10)
    isAdmin = models.BooleanField(db_column="IsAdmin", default=False)

    class Meta:
        db_table = 'account'
        ordering = ['account_id']
        managed = False

    def __str__(self):
        return self.name
    
    def set_info(self, raw_name, raw_password):
        self.name = raw_name
        self.password = raw_password

class Ticket(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    account = models.ForeignKey(Account, on_delete=models.SET_NULL, related_name='tickets', null=True, db_column='Account_Id')
    license = models.CharField(db_column='License', max_length=10) 
    timein = models.DateTimeField(db_column='TimeIn')
    timeout = models.DateTimeField(db_column='TimeOut', blank=True, null=True) 
    total = models.DecimalField(db_column='Total', max_digits=18, decimal_places=3, blank=True, null=True)  
    ispaid = models.BooleanField(db_column='IsPaid')  

    class Meta:
        ordering = ['id']
        db_table = 'ticket'
        managed = False
    
    def update_tickets_account(cls, license, account):
        tickets = cls.objects.filter(license=license)
        if tickets.exists():
            tickets.update(account=account)
        else:
            pass
    
class ParkingLot(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    isfree = models.BooleanField(db_column='IsFree')

    class Meta:
        ordering = ['id']
        db_table = 'parkinglot'
        managed = False

    def change_status(self, isfree):
        self.isfree = not isfree