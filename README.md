# Проект react-styled-components-typescript. Основные особенности.

## Описание приложения:
Простой интерфейс состоящий из одного компонента App в котором есть заголовок и кнопка.
При нажатии на кнопку размер текста и сам текст заголовка будут меняться.

### Создание проекта:
1. Создание проекта: npx create-react-app . --template typescript
2. Установка библиотеки:  npm install styled-components

### Файл App.tsx
```typescript
import { FC, useState } from "react";

const App: FC = () => {
  const [isBig, setBig] = useState(false);
  return (
    <div>
      <h3>{isBig ? "Большой" : "Маленький"} текст</h3>
      <button onClick={() => setBig(!isBig)}>Изменить размер</button>
    </div>
  );
};

export default App;
```

## ПРОБЛЕМА 1 - УСТАНОВКА ДОПОЛНИТЕЛЬНОГО МОДУЛЯ @types
    1. Создадим компонент sc для нашего заголовка: const Title = styled.h3`color: "red"`
    2. Для корректной работы в приложении с TS мы можем дополнительно установить модуль: npm install --save-dev @types/styled-components.

## ПРОБЛЕМА 2 - ТИПЫ ДЛЯ ПРОПС
    1. Для работы с элементом Title внутри него мы будем передавать пропс isBig, для того что бы менять размер текста исходя из значения isBig.
    2. Передаем пропс в Title: <Title isBig={isBig}> и у нас возникает ошибка. Это ошибка связана с тем, что нам надо указать какие именно пропсы ожидает данный компонент.
    3. Делается это через дженерик. Переходим к компоненту Title и добавляем в дженерик тега объект, внутри которого описываем, что будет ожидать наш компонент: const Title = styled.h3<{isBig?: boolean}>``
    4. И далее реализовывем внутри компонента Title логику изменения размера текста: font-size: ${({isBig}) => isBig ? "60px" : "20px"};

## ПРОБЛЕМА 3 - ТИПЫ ДЛЯ ТЕМЫ
    1. Создаем объект темы, которую хотим провайдить в приложение. В эту тему вынесем color из Title.
    2. Создаем объект theme: 
```typescript
const theme = {
  colors: {
    red: "#ff0000"
  }
}
```
    3. Прокидываем объект через ThemeProvider вместо основного div.
    4. Заменяем цвет в Title на наш новый цвет из темы:
```typescript
const Title = styled.h3<{isBig?: boolean}>`
  color: ${({theme}) => theme.colors.red};
  font-size: ${({isBig}) => isBig ? "60px" : "20px"};
```
    5. И тут можно наблюдать некоторый нюанс. Если мы поменяем цвет на несуществующий, например на orange: color: ${({theme}) => theme.colors.orange};, то у нас в проекте не возникнет ошибки. Однако, если мы создаем проект на TS мы расcчитываем, что такие ошибки обязательно будут подсвечены с помощью автокомплита и мы исправляем их еще на этапе написания кода.
    Что бы автокомплит срабатывал для нашей темы нам нужно прокинуть для этой темы ТИП. Что бы создать тип для ТЕМЫ нам нужно воспользоваться declare module:
```typescript
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      red: string
    }
  }
}
```

## Разъяснение по declare module:
**Что такое declare module?**
При создании проекта на React с использованием TypeScript, иногда может потребоваться объявить модуль с помощью ключевого слова declare module. Это позволяет определить типы для модулей, которые не имеют объявлений типов или для которых требуется расширение существующих типов.

**Для чего он нужен и где применяется?**
declare module используется для добавления типов к модулям, которые не имеют явного объявления типов. Это может быть полезно, когда вы работаете со сторонними библиотеками или модулями, которые не предоставляют типы TypeScript "из коробки".

Применение declare module позволяет TypeScript понимать структуру и типы объектов, функций и переменных внутри модуля, что облегчает разработку и предотвращает ошибки типов.

**Как использовать declare module вместе с библиотекой styled-components в проекте на React TypeScript?**
Пример того, как вы можете использовать declare module с библиотекой styled-components:

Создайте файл с расширением .d.ts, например styled.d.ts.
В файле styled.d.ts, используйте declare module для добавления типов к модулю styled-components:
```typescript
declare module 'styled-components' {
  export interface DefaultTheme {
    // Определите здесь типы для вашей темы
  }
}
```
Внутри declare module, вы можете определить типы для вашей темы styled-components. Например, вы можете определить цвета, шрифты и другие свойства вашей темы.
```typescript
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  }
}
```
После создания файла styled.d.ts, вы можете использовать типы вашей темы styled-components в вашем проекте:
```typescript
import styled, { DefaultTheme } from 'styled-components';

const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.secondary};
  font-family: ${(props) => props.theme.fonts.heading};
`;

const theme: DefaultTheme = {
  colors: {
    primary: 'blue',
    secondary: 'white',
  },
  fonts: {
    heading: 'Arial',
    body: 'Helvetica',
  },
};

// Используйте тему в вашем приложении
<ThemeProvider theme={theme}>
  <Button>Кнопка</Button>
</ThemeProvider>;
```

**Таким образом, вы можете использовать declare module вместе с библиотекой styled-components в проекте на React TypeScript, чтобы добавить типы для вашей темы и использовать их в ваших стилизованных компонентах.**

**Примечание**: Убедитесь, что у вас установлены необходимые пакеты, включая styled-components и @types/styled-components, чтобы использовать типы styled-components в вашем проекте.
