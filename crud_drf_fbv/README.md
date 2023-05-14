# crud DRF cbv

####Passo 1: 

instalação das bibliotecas/frameworks
`pip install django djangorestframework mysqlclient`


####Passo 2:

criar um projeto
`django-admin startproject crud_drf_fbv && cd crud_drf_fbv`


####Passo 3:

inserir o `rest_framework` no INSTALLED_APPS


####Passo 3:

criar um aplicativo
`python manage.py startapp usuarios`


####Passo 3:

criar o bd e fazer configuração do banco de dados no arquivo *settings.py*
<pre>
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mydatabase',
        'USER': 'mydatabaseuser',
        'PASSWORD': 'mypassword',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
</pre>

####Passo 4:

configurar o modelo do usuario de acordo com o banco de dados em *models.py*
<pre>
from django.db import models

class Usuario(models.Model):
    id = models.IntegerField(primary_key=True)
    nome = models.CharField(max_length=255)
    email = models.EmailField(max_length=45)
    idade = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'usuarios'

    def __str__(self):
        return self.nome
</pre>

* adicione 'class Meta:' para caso já tenha a tabela no banco de dados, onde 'managed' informará se será feito a criação de uma nova tabela e 'db_table' faz a referencia da tabela já existente

####Passo 3:

inserir `usuarios.apps.UsuariosConfig` no INSTALLED_APPS


####Passo 3:

registrar o modelo de Usuario no admin
<pre>
# Register your models here.

from django.contrib import admin
from .models import Usuario

admin.site.register(Usuario)
</pre>


####Passo 4:

configurar o serializador do usuarios em *serializers.py*
<pre>
from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nome = serializers.CharField(max_length=100)
    email = serializers.EmailField(max_length=100)
    idade = serializers.IntegerField()

    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'idade']
</pre>


####Passo 5:

definir as views/controladores em *views.py*
<pre>
from rest_framework import generics
from .models import User
from .serializers import UserSerializer

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
</pre>


####Passo 6:

definir as rotas em *urls.py* referente às views criadas no passo anterior
<pre>
from django.contrib import admin
from django.urls import path
from .views import ListaUsuarios

urlpatterns = [
    path('/', ListaUsuarios.as_view()),
]
</pre>

####Passo X:

adicionar as rotas do aplicativo "usuarios/urls.py" no projeto "crud_django_rest/urls.py"
<pre>
from django.urls import include, path

path('', include('usuarios.urls')),
</pre>


####Passo X:

fazer as migrations do banco de dados

*quando **não temos** um banco de dados existente
`python manage.py makemigrations`

*quando **temos** um banco de dados existente
`python manage.py makemigrations usuarios --empty --name migrate_existing_db`
criará um arquivo de migração vazio com nome 0001_migrate_existing_db

*adicione as operações necessárias para criar as tabelas e colunas do banco de dados existente

<pre>
operations = [
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.IntegerField(primary_key=True)),
                ('nome', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=255)),
                ('idade', models.IntegerField()),
            ],
            options={
                'managed': False,
                'db_table': 'usuarios',
            },
        ),
    ]
</pre>

* adicione options para caso já tenha a tabela no banco de dados, onde 'managed' informará se será feito a criação de uma nova tabela e 'db_table' faz a referencia da tabela já existente


####Passo X:

aplicar as migrações em um banco de dados (aplica se ainda não tiverem sido aplicadas)
`python manage.py migrate`

na execução criará tabelas no banco de dados para os INSTALLED_APPS:
<pre>
'django.contrib.admin',
'django.contrib.auth',
'django.contrib.contenttypes',
'django.contrib.sessions',
'django.contrib.messages',
'django.contrib.staticfiles',
</pre>

As migrações de auth e admin são migrações padrão fornecidas pelo Django.

As migrações de autenticação (auth) incluem as tabelas do banco de dados para gerenciar usuários, grupos e permissões. Isso inclui a tabela auth_user, que armazena informações do usuário, como nome de usuário, senha e endereço de e-mail.

As migrações de admin incluem as tabelas de banco de dados para suportar o painel de administração do Django. Isso inclui tabelas como django_admin_log para registrar as ações do usuário no painel de administração, e django_content_type para acompanhar os tipos de modelo registrados no painel de administração.


####Passo X:

iniciar o servidor
`python manage.py runserver`
