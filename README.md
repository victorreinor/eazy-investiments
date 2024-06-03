# Eazy Investments Facilitator

Eazy Investments é um sistema totalmente automatizado que, com base nos parâmetros fornecidos, busca todos os fundos imobiliários brasileiros, seleciona os melhores de acordo com os critérios estabelecidos e calcula o retorno do investimento.

## 📊 Parâmetros de Seleção

Os parâmetros utilizados para a seleção dos fundos são os seguintes:

| Parâmetro           | Condição              |
|---------------------|-----------------------|
| Dividend Yield      | >= 0.4                |
| P/VP                | Entre 0.4 e 1.2       |
| Valor de Mercado    | >= R$ 500.000.000,00  |
| Vacância Média      | <= 30%                |
| Liquidez            | >= R$ 1.000.000,00    |

## 📈 Exemplo de Seleção e Cálculo de Retorno

Os resultados da seleção são apresentados em uma tabela como a seguinte:

| Papel   | Segmento | Cotação | Dividend Yield | P/VP  | Valor de Mercado | Liquidez     | Vacância Média | Tipo de Dividendo | Data COM  | Dividendo | Valor Investido | Qtde de Papel | Retorno de Dividendos | Link                                                                 |
|---------|----------|---------|----------------|-------|------------------|--------------|----------------|-------------------|-----------|-----------|-----------------|---------------|-----------------------|---------------------------------------------------------------------|
| ALZR11  | Híbrido  | R$ 109,99 | 8.95%          | 1.04  | R$ 1.084.550.000 | R$ 1.991.970 | 0.00%          | Dividendos        | 17/05/2024 | R$ 0,73   | R$ 1.000,00      | 9             | R$ 6,57                | [Link](https://investidor10.com.br/fiis/ALZR11/) |

## 💻 Requisitos

Certifique-se de ter o Node Version Manager (nvm) instalado na sua máquina para rodar o projeto.

## ⚙️ Instalação e Execução

1. **Selecione a versão correta do Node.js:**
    ```bash
    nvm use
    ```
    Se a versão não estiver instalada, instale-a com:
    ```bash
    nvm install
    ```

2. **Instale as dependências do projeto:**
    ```bash
    npm install
    ```

3. **Inicie o projeto:**
    ```bash
    npm start
    ```

## 🔧 Configuração

Para modificar os parâmetros de busca, edite o arquivo `src/index.js` e ajuste os parâmetros conforme desejado.