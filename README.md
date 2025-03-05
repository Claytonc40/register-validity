# Controle de Validade - Aplicativo React Native

Este aplicativo foi desenvolvido para ajudar a controlar as datas de validade dos produtos, evitando desperdício e garantindo que você consuma seus alimentos antes que vençam.

## Correções Realizadas

Alguns problemas foram identificados e corrigidos neste projeto:

1. Substituição de componentes personalizados (`Themed`) por componentes nativos do React Native

   - Modificados arquivos em `app/(tabs)/` para usar `Text` e `View` diretamente do React Native
   - Ajustado o `_layout.tsx` para remover dependências de componentes inexistentes

2. Ajustes nas importações
   - Corrigido o path das importações de hooks e constants
   - Removida a dependência da pasta hooks/useColorScheme

## Como executar o aplicativo

Se você estiver enfrentando problemas ao iniciar o aplicativo, siga estas etapas:

1. Encerre qualquer processo Metro Bundler em execução:

   ```
   npx kill-port 8081
   ```

2. Limpe o cache:

   ```
   npm start -- --reset-cache
   ```

3. Inicie o aplicativo:

   ```
   npm start
   ```

4. Em um novo terminal, execute no Android:

   ```
   npm run android
   ```

   Ou no iOS (requer macOS):

   ```
   npm run ios
   ```

## Funcionalidades

- Adicionar produtos com suas datas de validade
- Visualizar produtos ordenados por data de validade
- Identificação visual de produtos vencidos (vermelho) e prestes a vencer (amarelo)
- Persistência de dados utilizando AsyncStorage
- Interface amigável e intuitiva

## Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- AsyncStorage para persistência de dados
- DateTimePicker para seleção de datas
