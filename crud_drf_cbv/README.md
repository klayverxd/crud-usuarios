# crud DRF ClassBasedView

####Passo 1: 

instalação das bibliotecas/frameworks
`pip install django djangorestframework mysqlclient`


####Passo 2:

criar um projeto
`django-admin startproject crud_drf_cbv && cd crud_drf_cbv`


####Passo 3:

criar um aplicativo
`python manage.py startapp usuarios`


####Passo 3:

inserir o `rest_framework` e a aplicação `usuarios` no INSTALLED_APPS em `settings.py`

Necessário para a indicação ao Django que a aplicação faz parte do projeto e que deve ser carregada quando o projeto for iniciado.

Adicionar o rest_framework ao INSTALLED_APPS define a dependência do projeto em relação ao DRF, onde o Django verificará se o DRF está instalado no ambiente Python antes de iniciar o projeto, e exibirá um erro se o DRF não estiver instalado.

O Django carregará automaticamente os arquivos de configuração do DRF, incluindo as definições de roteamento de URL e as configurações de autenticação e permissão.


####Passo 3:

criar o bd no MySQL e fazer configuração do banco de dados no arquivo *settings.py*
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

configurar o modelo da classe Usuario em `usuario.models`
<pre>
from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=255)
    email = models.EmailField(max_length=45)
    idade = models.IntegerField()

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.nome
</pre>

* A classe Meta é usada para definir metadados adicionais sobre o modelo. Aqui, é especificado o nome da tabela do banco de dados para ser "usuarios". Também é possível adicionar o metadado 'managed', que informará se será feito a criação de uma nova tabela
  
* O método `__str__` é definido para representar o objeto do modelo como uma string. Neste caso, é retornado o nome do usuário.

* O django fornece modelos já prontos, como usuários de autenticação, [aqui](https://docs.djangoproject.com/en/4.2/topics/auth/default/)


####Passo 3:

registrar o modelo Usuario no admin
<pre>
# Register your models here.

from django.contrib import admin
from .models import Usuario

admin.site.register(Usuario)
</pre>

* Ele é responsável por registrar o modelo "Usuario" para que possa ser gerenciado através do painel administrativo do Django.
  
* A função "register" é um método da classe "AdminSite" que recebe como parâmetro o modelo a ser registrado. Nesse caso, o modelo "Usuario" foi registrado no painel administrativo.

* Isso significa que, ao acessar o painel administrativo, haverá uma seção para gerenciamento de usuários, onde será possível listar, criar, atualizar e deletar registros da tabela "usuarios".


####Passo 4:

configurar o serializador do usuario em *serializers.py*
<pre>
from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'idade']
</pre>

* Essa classe define uma representação serializada do modelo Usuario e define como ele deve ser convertido para JSON ou outro formato serializado, utilizando a classe ModelSerializer.

* Na classe Meta é definido o modelo com o qual o Serializer deve trabalhar, e são especificados quais campos do modelo serão serializados. Neste caso, o Serializer irá retornar um JSON contendo o id, nome, email e idade de um usuário.


####Passo 5:

definir as views (controladores dos métodos HTTP) em *views.py*

######Rotas GET e POST
<pre>
class ListaUsuario(APIView):
    def get(self, request, format=None):
        usuario = Usuario.objects.all()
        serializer = UsuarioSerializer(usuario, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = UsuarioSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'mensagem': 'Usuário adicionado com sucesso!'}, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
</pre>

* A classe ListaUsuario é uma subclasse da classe APIView. As duas operações de CRUD, "listar" e "criar", são definidas por meio dos métodos get e post.
  
* No método get, a view busca todos os objetos Usuario do banco de dados utilizando a classe Usuario.objects.all() e, em seguida, serializa esses objetos utilizando a classe UsuarioSerializer. O argumento many=True passado ao serializador indica que há vários objetos a serem serializados, em vez de um único objeto.

* Já no método post, a view recebe uma requisição com os dados do novo usuário a ser adicionado, que são validados pelo serializer UsuarioSerializer. Caso os dados sejam válidos, o novo usuário é salvo no banco de dados com o método save(), e uma mensagem de sucesso é retornada como resposta com o código de status HTTP_201_CREATED. Caso contrário, uma mensagem de erro com o código de status HTTP_400_BAD_REQUEST é retornada.

######Rotas PUT e DELETE
<pre>
class DetalhesUsuario(APIView):
    def get_object(self, pk):
        try:
            return Usuario.objects.get(pk=pk)
        except Usuario.DoesNotExist:
            raise Http404
    
    def put(self, request, pk, format=None):
        usuario = self.get_object(pk)
        serializer = UsuarioSerializer(usuario, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'mensagem': 'Usuário atualizado com sucesso!'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        usuario = self.get_object(pk)
        usuario.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
</pre>

* A classe DetalhesUsuario também é uma subclasse da APIView e implementa os métodos HTTP PUT e DELETE para atualizar e excluir um usuário, respectivamente.
  
* O método get_object(pk) é uma função auxiliar para recuperar o usuário com o id correspondente a pk (primary key). Se não houver usuário com o id fornecido, ele retornará um erro 404. 
  
* O método put recebe a requisição HTTP PUT com dados JSON atualizados para um usuário e, em seguida, valida os dados usando o serializer UsuarioSerializer. Se os dados forem válidos, o serializer salva as atualizações no banco de dados e retorna uma mensagem de sucesso. Se os dados não forem válidos, o método retornará uma mensagem de erro 400.
  
* O método delete recebe uma requisição HTTP DELETE e remove o usuário correspondente ao id pk. Em seguida, ele retorna uma mensagem de sucesso com o status 204.


####Passo 6:

definir as rotas em *urls.py* referente às views criadas no passo anterior
<pre>
from django.urls import path
from usuarios import views

urlpatterns = [
    path('usuarios/', views.ListaUsuario.as_view()),
    path('usuarios/<int:pk>/', views.DetalhesUsuario.as_view()),
]
</pre>

* Este é um exemplo de arquivo de rotas para o aplicativo "usuarios". Neste exemplo, temos duas rotas que serão utilizadas na aplicação:
  
  1. `usuarios/`: esta rota aponta para a classe de visualização ListaUsuario definida no arquivo views.py do aplicativo usuarios. Quando um usuário acessa essa rota usando o método GET, todos os usuários cadastrados no banco de dados são retornados como resposta em formato JSON. Quando um usuário usa o método POST, um novo usuário é adicionado ao banco de dados.

  2. `usuarios/<int:pk>/`: esta rota aponta para a classe de visualização DetalhesUsuario definida no arquivo views.py do aplicativo usuarios. Quando um usuário acessa essa rota usando o método PUT, os dados do usuário com o ID fornecido são atualizados com os novos dados fornecidos no corpo da solicitação. Quando um usuário usa o método DELETE, o usuário com o ID fornecido é excluído do banco de dados.


####Passo X:

adicionar as rotas do aplicativo "usuarios/urls.py" no projeto "crud_drf_cbv/urls.py"
<pre>
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('usuarios.urls')),
]
</pre>

* A primeira URL incluída no arquivo é path('admin/', admin.site.urls), que define a URL da interface administrativa do Django. A próxima URL é path('', include('usuarios.urls')), que define as URLs para o aplicativo usuarios, que é definido em outro arquivo de URL (usuarios/urls.py).

* Essa abordagem permite a modularização do código e torna mais fácil a organização e manutenção do projeto. Além disso, facilita a inclusão de novas aplicações no projeto.


####Passo X:

fazer as migrations do banco de dados

As migrações são usadas para sincronizar o banco de dados com as alterações feitas nos modelos do aplicativo.

Quando um modelo é alterado, o Django REST Framework gera um arquivo de migração que descreve a alteração. Esses arquivos de migração são armazenados em um diretório chamado "migrations" no aplicativo. Em seguida, os arquivos de migração precisam ser aplicados ao banco de dados para atualizá-lo, que é executado no próximo passo.

Quando **não temos** um banco de dados existente:
    `python manage.py makemigrations`

Quando **temos** um banco de dados existente (criará um arquivo de migração vazio com nome 0001_migrate_existing_db):
    `python manage.py makemigrations usuarios --empty --name migrate_existing_db`


* após a criação dos arquivos adicione as operações necessárias para criar as tabelas e colunas do banco de dados, caso precise

* Para criar as migrações iniciais do aplicativo, usamos o comando python manage.py makemigrations. Esse comando analisa os modelos e cria as migrações necessárias para criar as tabelas do banco de dados.

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


falar sobre o painel de administração
