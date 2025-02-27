# Para iniciar o projeto
- Faça um clone do projeto ```git clone git@github.com:guihvdev/ozmap-test.git```
- Instale as dependências do projeto ```yarn``
- Suba os containers da aplicação ```docker compose up --build```
- A api será exposta na porta 3000!

# Testes
- Rode o comando ```yarn test``` para execução dos testes unitários.
- Rode o comando ```yarn test:e2e``` para execução dos testes end to end.
- Obs: Iniciar o banco com docker previamente seguindo instruções anteriores.

# Chamadas a API
- Utilize a extensão REST Client do VSCode e abra o arquivo ```requests.http``` para efetuar as requisições

# Regras de negócio

## Usuário
### Ao criar:
- Deve prover um email válido
- Usuário deve prover somente endereço ou coordenadas e backend resolverá a informação faltante
- Deve prover um email único e ainda não usado
### Ao editar:
- Deve prover somente endereço ou coordenadas

## Regiões
### Ao criar:
- Deve prover um polígono válido
- Não pode conflitar com um polígono já criado
### Ao editar:
- Deve prover um polígono válido
- Não pode conflitar com um polígono já criado