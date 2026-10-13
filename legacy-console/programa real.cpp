#include <stdio.h>
#include <stdlib.h>
#define tam 2 //define o tamanho do vetor

struct livro
{
	int codigo;
	char titulo[50];
	char autor[30];
	char area[30];
	int ano;
	char editora[30];
	
};

int main()
{
	struct livro ficha[tam];
	struct livro troca;
	int busca, i, j, acha, op;
	
	op=0;
	while (op !=5)
	{
		printf("1- cadastrar os livros\n");
		printf("2- imprimir os livros cadastrados\n");
		printf("3- Pesquisar os livros por codigo\n");
		printf("4- Ordenar os livros por ano\n");
		printf("5- sair\n");//o laço op no while
		printf("- Digite a opção desejada:\n");
	    scanf("%d", &op);
	    fflush(stdin);//limpa buffle to teclado
	   	    
	    
	    if(op==1)
	    {
	    	system("cls");//limapa tudo que foi printado na tela
	    	for(i=0;i<tam; i++)
	    	{
	    		printf("digite o codigo do livro da posição %d:\n", i+1);
	    		scanf("%d", &ficha[i].codigo);
	    		fflush(stdin);
	    		printf("digite o titulo do livro:\n");
	    		scanf("%*50[^\n]%*s", &ficha[i].titulo);
				fflush(stdin); 
				printf("digite o nome do autor\n");
				scanf("%*30[^\n]%*s", &ficha[1].autor);
				fflush(stdin);
				printf("digite a area do livro\n");
				scanf("%*30[^\n]%*s", &ficha[1].area);
				fflush(stdin);
				printf("digite o ano do livro\n");
	    		scanf("%d", &ficha[i].ano);
	    		fflush(stdin);
	    		printf("digite o nome da editorar\n");
				scanf("%*30[^\n]%*s", &ficha[1].editora);
				fflush(stdin);
	    		
				
			}
	    	
		}
		else
		{
			if(op==2)
			{
				
	    	system("cls");
	    	for(i=0;i<tam; i++)
	    	{
	    		printf("\n codigo: %d\n", ficha[i].codigo);
	    		printf("\n titulo: %d\n", ficha[i].titulo);
	    		printf("\n autor: %d\n", ficha[i].autor);
	    		printf("\n area: %d\n", ficha[i].area);
	    		printf("\n ano: %d\n", ficha[i].ano);
	    		printf("\n editora: %d\n", ficha[i].editora);
	    		
			}
			}
		
		else{
			if(op==3)
			{
			system("cls");
		    printf("digite o codigo que deseja buscar: ");
		    scanf("%d", &busca);
		    i=0;
		    acha=0;
		    while((i<tam)&&(acha==0))
		    {
		    	if(ficha[i].codigo==busca)
		    	acha=1;
		    	else
		    	i++;
		    	if(acha==1)
		    	{
		    	printf("\n codigo: %d\n", ficha[i].codigo);
	    		printf("\n titulo: %d\n", ficha[i].titulo);
	    		printf("\n autor: %d\n", ficha[i].autor);
	    		printf("\n area: %d\n", ficha[i].area);
	    		printf("\n ano: %d\n", ficha[i].ano);
	    		printf("\n editora: %d\n", ficha[i].editora);
				}
				else
				printf("registro não encontrado");
				
		    	
			}
			}
			
			else
			{
				if(op==4)
				{
			system("cls");
	    	for(i=0;i<tam-1; i++)
	    	{
	    		for(j=j+1;j<tam;j++)
	    		{
	    			if(ficha[i].ano>ficha[j].ano)
	    			{
	    				troca=ficha[i];
	    				ficha[1]=ficha[j];
	    				ficha[j]=troca;
					}
				}
			}
			for(i=0;i<tam-1; i++)
			{
				printf("\n codigo: %d\n titulo: %s\n ano: %d\n", ficha[i].codigo, ficha[i].titulo, ficha[i].ano);
			}
				}
			}
			}
		}
	    
	    
	}
	
	
	return(0);
	
}
