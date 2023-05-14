from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(max_length=45)
    idade = models.IntegerField()

    class Meta:
        db_table = 'usuarios_fbv'

    def __str__(self):
        return self.nome
