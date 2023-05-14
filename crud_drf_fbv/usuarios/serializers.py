from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField(max_length=100)
    idade = serializers.IntegerField()

    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'idade']
