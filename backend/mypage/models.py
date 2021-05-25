from django.db import models


class TestProduct(models.Model):
    name = models.CharField('test product name', max_length=50)

    def __str__(self):
        return self.name


class TestUser(models.Model):
    name = models.CharField('test user name', max_length=10)
    wish = models.ManyToManyField(TestProduct, related_name='test_wish')
    bag = models.ManyToManyField(TestProduct, related_name='test_bag')
    buy = models.ManyToManyField(TestProduct, related_name='test_buy')

    def __str__(self):
        return self.name