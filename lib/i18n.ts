export const LOCALES = ["en", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Name of the header the middleware uses to hand the resolved locale to the app. */
export const LOCALE_HEADER = "x-locale";

/** Name of the cookie that remembers an explicit `?lang=` choice. */
export const LOCALE_COOKIE = "locale";

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Picks the best supported locale out of an `Accept-Language` header,
 * honouring q-values. `pt-BR,pt;q=0.9,en;q=0.8` resolves to `pt`.
 */
export function parseAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="));

      return {
        tag: tag.trim().toLowerCase(),
        q: quality ? Number(quality.slice(2)) : 1,
      };
    })
    .filter((entry) => entry.tag !== "" && Number.isFinite(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }

  return DEFAULT_LOCALE;
}

/** URLs written inline in `answer` are turned into links at render time. */
export type FaqItem = {
  readonly question: string;
  readonly answer: string;
};

/**
 * What a dictionary entry is allowed to be. Recursive so sub-sections like
 * `wizard.colors` can nest without the union having to spell out each depth.
 */
type DictionaryValue =
  | string
  | readonly string[]
  | readonly FaqItem[]
  | { readonly [key: string]: DictionaryValue };

export const dictionaries = {
  en: {
    title: "The Git Calendar",
    subtitle: "Show your contributions on your mobile screen.",
    builtBy: "Built by",
    metaDescription:
      "Turn your GitHub contribution graph into a wallpaper that updates itself every day.",
    installIos: "Install on iOS",
    installAndroid: "Install on Android",
    installDesktop: "Install on Desktop",
    soon: "Soon",
    wallpaperAlt: "GitHub contribution graph as an iPhone wallpaper",
    aboutTitle: "About the project",
    aboutParagraphs: [
      "Hey, I'm **Matheus Audibert**, a software engineer at Itaú Unibanco. I built this project in a few hours, during a productive late night. The idea was simple: **I wanted to see my GitHub contribution graph on my wallpaper every day**. What I did not expect was for it to **go viral**, much less to find out that plenty of other devs wanted exactly the same thing.",
      "It's really cool to see something that started as a personal idea being used by so many people. **Thank you** to everyone using, sharing and supporting the project!"
    ],
    testimonialQuote: "A wallpaper that updates your commits daily 🤯🤯🤯",
    faqTitle: "FAQ",
    faq: [
      {
        question: "Is the project open source?",
        answer:
          "Yes, the project is open source and lives in these repositories: https://github.com/matheusaudibert/thegitcalendar and https://github.com/matheusaudibert/thegitcalendar-front. Yes, I split the back end and the front end.",
      },
      {
        question: "Can I customize the wallpaper?",
        answer:
          "Yes, you can customize the wallpaper. You can change the color and the shape of the contributions, as well as the background color of the image. To see every possible combination, go to https://github.com/matheusaudibert/thegitcalendar/blob/main/EXAMPLES.md.",
      },
      {
        question: "Does the wallpaper count private contributions?",
        answer:
          "No, the wallpaper does not count private contributions. For them to show up, you have to enable them in your GitHub account. For more information, see this article: https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements#changing-the-visibility-of-your-private-contributions.",
      },
      {
        question: "Does the project support every phone?",
        answer:
          "Not yet. I'm working on supporting as many iPhone and Android models as possible.",
      },
      {
        question: "How does this project work?",
        answer:
          'Basically, I built an API that returns an image formatted for a phone screen, showing a user\'s contribution graph. You set your phone to make a GET request to that API and use the result as your wallpaper. On iPhone this is done natively through "Shortcuts" automations. Android has no native equivalent, so you need the "MacroDroid" app to create the automation.',
      },
    ],
    wizard: {
      drawerTitleApple: "Install on iOS",
      drawerTitleAndroid: "Install on Android",
      drawerDescriptionApple:
        "Set up an automation that refreshes your wallpaper every day.",
      drawerDescriptionAndroid:
        "Set up a MacroDroid macro that refreshes your wallpaper every day.",

      usernameTitle: "GitHub username",
      usernameDescription:
        "Enter the GitHub username whose contributions you want on your wallpaper.",
      usernamePlaceholder: "your-github-username",
      usernameNotFound:
        "We couldn't find a GitHub user with that username. Double-check the spelling and try again.",
      usernameRateLimited:
        "GitHub is rate-limiting this browser, so we can't check the username right now. Wait a few minutes and try again.",

      deviceTitle: "Choose device model",
      deviceDescription:
        "This determines the exact resolution used for your wallpaper.",
      iphonePlaceholder: "Select your iPhone model",
      androidPlaceholder: "Search your Android device...",
      deviceEmpty: "No device found.",

      customizeTitle: "Customize",
      customizeDescription: "Tweak the look of your wallpaper.",
      commitColor: "Commit Color",
      commitShape: "Commit Shape",
      backgroundColor: "Background Color",

      copy: "Copy",
      copied: "Copied!",
      close: "Close",

      colors: {
        green: "Green",
        blue: "Blue",
        purple: "Purple",
        red: "Red",
        yellow: "Yellow",
        orange: "Orange",
        pink: "Pink",
        white: "White",
        black: "Black",
      },
      shapes: {
        rounded: "Rounded",
        square: "Square",
        circle: "Circle",
      },
      backgrounds: {
        github: "GitHub",
        dark: "Dark",
        light: "Light",
      },
    },
    instructions: {
      appleCreateShortcutTitle: "Create shortcut",
      appleCreateShortcutBody:
        'Open [Shortcuts](https://apps.apple.com/app/id915249334) app → Go to **Automation** tab → New Automation → **Time of Day** → **6:00 AM** → Repeat **"Daily"** → Select **"Run Immediately"** → **"Create New Shortcut"**',
      appleCreateAutomationTitle: "Create automation",
      appleAddActions: "Add these actions:",
      appleGetContentsTitle: "Get Contents of URL",
      applePasteUrl: "Paste the following URL there:",
      appleSetWallpaperTitle: "Set Wallpaper Photo",
      appleChooseLockScreen: 'Choose "Lock Screen"',
      appleCropNote:
        'In **"Set Wallpaper Photo"**, tap the arrow (→) to show options → disable both **"Crop to Subject"** and **"Show Preview"**. This prevents iOS from cropping and asking for confirmation each time.',

      androidSetupMacroTitle: "Setup Macro",
      androidOpenMacrodroid:
        "Open [MacroDroid](https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid) → Add Macro",
      androidTrigger:
        "**Trigger:** Date/Time → Day/Time → Set time to **00:01:00** → Activate **all weekdays**",
      androidConfigureActionsTitle: "Configure Actions",
      androidDownloadImageTitle: "Download Image",
      androidHttpRequest: "Go to **Web Interactions** → **HTTP Request**",
      androidRequestMethod: "Request method: GET",
      androidPasteUrl: "Paste the URL below:",
      androidBlockNext: "Enable: **Block next actions until complete**",
      androidSaveResponse: 'Response: Tick **"Save HTTP response to file"**',
      androidDownloadPath: "Folder & filename: `/Download/life.png`",
      androidSetWallpaperTitle: "Set Wallpaper",
      androidDeviceSettings: "Go to **Device Settings** → **Set Wallpaper**",
      androidImageAndScreen: "Choose **Image and Screen**",
      androidWallpaperPath: "Enter folder & filename: `/Download/life.png`",
      androidSamePathNote:
        "Use the **exact same folder and filename** in both actions.",
      androidFinalizeTitle: "Finalize",
      androidFinalizeBody: 'Give the macro a name → Tap **"Create Macro"**',
      androidManagingTitle: "Testing & Managing",
      androidTest:
        "**Test:** MacroDroid → Macros → select your macro → More options → **Test macro**",
      androidStop: "**Stop:** Toggle off or delete the macro",
      androidEditUrl:
        "**Edit URL:** Tap the HTTP Request action → Update the URL → **Save**",
    },
  },
  pt: {
    title: "The Git Calendar",
    subtitle: "Mostre suas contribuições do GitHub na tela do seu celular.",
    builtBy: "Feito por",
    metaDescription:
      "Transforme seu gráfico de contribuições do GitHub em um wallpaper que se atualiza todo dia.",
    installIos: "Instalar no iOS",
    installAndroid: "Instalar no Android",
    installDesktop: "Instalar no Desktop",
    soon: "Em breve",
    wallpaperAlt: "Gráfico de contribuições do GitHub como wallpaper de iPhone",
    aboutTitle: "Sobre o projeto",
    aboutParagraphs: [
      "Olá, eu sou **Matheus Audibert**, engenheiro de software no Itaú Unibanco. Criei este projeto em algumas horas, durante uma madrugada produtiva. A ideia era simples: **eu queria ver meu gráfico de contribuições do GitHub todos os dias no meu wallpaper**. O que eu não esperava era que o projeto **viralizasse**, e muito menos descobrir que vários outros devs também queriam exatamente a mesma coisa.",
      "É muito legal ver algo que começou como uma ideia pessoal sendo usado por tanta gente. **Obrigado** a todos que estão usando, compartilhando e apoiando o projeto!"
    ],
    testimonialQuote: "Wallpaper que atualiza os commits diariamente 🤯🤯🤯",
    faqTitle: "FAQ",
    faq: [
      {
        question: "O projeto é open source?",
        answer:
          "Sim, o projeto é open source, e está disponível nos seguintes repositórios: https://github.com/matheusaudibert/thegitcalendar e https://github.com/matheusaudibert/thegitcalendar-front. Sim, eu separei back e front end.",
      },
      {
        question: "Posso personalizar o wallpaper?",
        answer:
          "Sim, você pode personalizar o wallpaper. Você pode editar a cor e o formato das contribuições e a cor do fundo da imagem. Para visualizar todas as combinações possíveis de personalização do wallpaper, acesse https://github.com/matheusaudibert/thegitcalendar/blob/main/EXAMPLES.md.",
      },
      {
        question: "O wallpaper conta as contribuições privadas?",
        answer:
          "Não, o wallpaper não conta as contribuições privadas. Para elas aparecerem você deve habilitá-las em sua conta do GitHub. Para mais informações acesse esse artigo: https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements#changing-the-visibility-of-your-private-contributions.",
      },
      {
        question: "O projeto contém todos os celulares?",
        answer:
          "Ainda não, estou trabalhando para desenvolver o suporte para todos os iPhones e Androids possíveis.",
      },
      {
        question: "Como esse projeto funciona?",
        answer:
          'Basicamente, desenvolvi uma API que retorna uma imagem formatada para celular, com o gráfico de contribuições de um usuário. O usuário define para o celular dele fazer um GET nessa API e definir como plano de fundo. No iPhone isso é feito de maneira nativa usando as automações do "Atalhos". O Android não tem essa funcionalidade de forma nativa, portanto é necessário baixar o aplicativo "MacroDroid" para criar uma automação.',
      },
    ],
    wizard: {
      drawerTitleApple: "Instalar no iOS",
      drawerTitleAndroid: "Instalar no Android",
      drawerDescriptionApple:
        "Configure uma automação que atualiza seu wallpaper todo dia.",
      drawerDescriptionAndroid:
        "Configure uma macro no MacroDroid que atualiza seu wallpaper todo dia.",

      usernameTitle: "Usuário do GitHub",
      usernameDescription:
        "Digite o usuário do GitHub cujas contribuições você quer no wallpaper.",
      usernamePlaceholder: "seu-usuario-do-github",
      usernameNotFound:
        "Não encontramos nenhum usuário do GitHub com esse nome. Confira a grafia e tente de novo.",
      usernameRateLimited:
        "O GitHub limitou as requisições deste navegador, então não dá para verificar o usuário agora. Espere alguns minutos e tente de novo.",

      deviceTitle: "Escolha o modelo do aparelho",
      deviceDescription:
        "É isso que define a resolução exata usada no seu wallpaper.",
      iphonePlaceholder: "Selecione seu modelo de iPhone",
      androidPlaceholder: "Busque seu aparelho Android...",
      deviceEmpty: "Nenhum aparelho encontrado.",

      customizeTitle: "Personalize",
      customizeDescription: "Ajuste a aparência do seu wallpaper.",
      commitColor: "Cor das contribuições",
      commitShape: "Formato das contribuições",
      backgroundColor: "Cor de fundo",

      copy: "Copiar",
      copied: "Copiado!",
      close: "Fechar",

      colors: {
        green: "Verde",
        blue: "Azul",
        purple: "Roxo",
        red: "Vermelho",
        yellow: "Amarelo",
        orange: "Laranja",
        pink: "Rosa",
        white: "Branco",
        black: "Preto",
      },
      shapes: {
        rounded: "Arredondado",
        square: "Quadrado",
        circle: "Círculo",
      },
      backgrounds: {
        github: "GitHub",
        dark: "Escuro",
        light: "Claro",
      },
    },
    instructions: {
      appleCreateShortcutTitle: "Criar atalho",
      appleCreateShortcutBody:
        'Abra o app [Atalhos](https://apps.apple.com/app/id915249334) → Vá até a aba **Automação** → Nova Automação → **Hora do Dia** → **06:00** → Repetir **"Diariamente"** → Selecione **"Executar Imediatamente"** → **"Criar Novo Atalho"**',
      appleCreateAutomationTitle: "Criar automação",
      appleAddActions: "Adicione estas ações:",
      appleGetContentsTitle: "Obter Conteúdo do URL",
      applePasteUrl: "Cole a seguinte URL ali:",
      appleSetWallpaperTitle: "Definir Foto do Papel de Parede",
      appleChooseLockScreen: 'Escolha "Tela Bloqueada"',
      appleCropNote:
        'Em **"Definir Foto do Papel de Parede"**, toque na seta (→) para mostrar as opções → desative **"Recortar no Assunto"** e **"Mostrar Pré-Visualização"**. Isso impede que o iOS recorte a imagem e peça confirmação toda vez.',

      androidSetupMacroTitle: "Configurar a macro",
      androidOpenMacrodroid:
        "Abra o [MacroDroid](https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid) → Adicionar Macro",
      androidTrigger:
        "**Gatilho:** Data/Hora → Dia/Hora → Defina o horário como **00:01:00** → Ative **todos os dias da semana**",
      androidConfigureActionsTitle: "Configurar as ações",
      androidDownloadImageTitle: "Baixar a imagem",
      androidHttpRequest: "Vá em **Interações Web** → **Requisição HTTP**",
      androidRequestMethod: "Método da requisição: GET",
      androidPasteUrl: "Cole a URL abaixo:",
      androidBlockNext:
        "Ative: **Bloquear as próximas ações até concluir**",
      androidSaveResponse:
        'Resposta: marque **"Salvar resposta HTTP em arquivo"**',
      androidDownloadPath: "Pasta e nome do arquivo: `/Download/life.png`",
      androidSetWallpaperTitle: "Definir papel de parede",
      androidDeviceSettings:
        "Vá em **Configurações do Dispositivo** → **Definir Papel de Parede**",
      androidImageAndScreen: "Escolha **Imagem e Tela**",
      androidWallpaperPath:
        "Informe a pasta e o nome do arquivo: `/Download/life.png`",
      androidSamePathNote:
        "Use **exatamente a mesma pasta e o mesmo nome de arquivo** nas duas ações.",
      androidFinalizeTitle: "Finalizar",
      androidFinalizeBody:
        'Dê um nome para a macro → Toque em **"Criar Macro"**',
      androidManagingTitle: "Testar e gerenciar",
      androidTest:
        "**Testar:** MacroDroid → Macros → selecione sua macro → Mais opções → **Testar macro**",
      androidStop: "**Parar:** desative ou apague a macro",
      androidEditUrl:
        "**Editar a URL:** toque na ação Requisição HTTP → atualize a URL → **Salvar**",
    },
  },
} as const satisfies Record<Locale, Record<string, DictionaryValue>>;

export type Dictionary = (typeof dictionaries)[Locale];

/**
 * `satisfies` above only constrains value types — it does not stop one locale
 * from drifting a key ahead of the other. This does: if `en` and `pt` ever
 * disagree on their key sets, one of these branches resolves to `never` and
 * the assignment fails to compile.
 */
type SameKeys<A, B> = [keyof A] extends [keyof B]
  ? [keyof B] extends [keyof A]
  ? true
  : never
  : never;

const _localesAgreeOnKeys: SameKeys<
  (typeof dictionaries)["en"],
  (typeof dictionaries)["pt"]
> = true;
void _localesAgreeOnKeys;
