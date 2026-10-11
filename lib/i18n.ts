export const LOCALES = ["en", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/**
 * The full BCP 47 tag `Intl` formats each locale with. `en-US` rather than
 * `en-GB` because CLDR abbreviates September as "Sept" for en-GB, while iOS
 * (which the lock-screen clock imitates) shows "Sep".
 */
export const INTL_LOCALES: Record<Locale, string> = {
  en: "en-US",
  pt: "pt-BR",
};

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
  /** Stable across locales; `components/faq-section.tsx` keys icons by it. */
  readonly id: string;
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
    subtitle: "Show your GitHub contributions on your mobile screen.",
    builtBy: "Built by",
    metaDescription:
      "Turn your GitHub contribution graph into a wallpaper that updates itself every day.",
    installIos: "Install on iOS",
    installAndroid: "Install on Android",
    starProject: "Star the project",
    wallpaperAlt: "GitHub contribution graph as an iPhone wallpaper",
    howTitle: "How it works",
    /** Keyed by the step ids in `components/how-it-works-section.tsx`. */
    howSteps: {
      copy: {
        title: "Copy your wallpaper URL",
        description:
          "Pick your colors and style, and copy the link to your personal image.",
      },
      automate: {
        title: "Set up the automation",
        description:
          "Create a Shortcuts automation on iPhone, or a MacroDroid macro on Android. It takes a couple of minutes.",
      },
      daily: {
        title: "Fresh every day",
        description:
          "Your wallpaper updates itself with your latest contributions — nothing else to do.",
      },
    },
    aboutTitle: "About the project",
    visitsLabel: "Visits",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The page you're looking for doesn't exist or has moved.",
    notFoundHome: "Back to home",
    aboutParagraphs: [
      "Hey, I'm **Matheus Audibert**, a software engineer. I built this project in a few hours, during a productive late night. The idea was simple: **I wanted to see my GitHub contribution graph on my wallpaper every day**. What I did not expect was for it to **go viral**, much less to find out that plenty of other devs wanted exactly the same thing.",
      "It's really cool to see something that started as a personal idea being used by so many people. **Thank you** to everyone using, sharing and supporting the project!"
    ],
    /** Keyed by the testimonial ids in `components/testimonial.tsx`. */
    testimonialQuotes: {
      samuelrizzon: "A wallpaper that updates your commits daily 🤯🤯🤯",
      devcelio:
        "And this wallpaper my buddy @audibertdev launched turned out really beautiful",
    },
    faqTitle: "FAQ",
    faq: [
      {
        id: "customize",
        question: "Can I customize the wallpaper?",
        answer:
          "Yes. You can choose the color and shape of the contribution squares, as well as the background color of the image.",
      },
      {
        id: "private",
        question: "Does the wallpaper include private contributions?",
        answer:
          "Only if your GitHub profile shows them. By default, GitHub displays public contributions only. To include private ones, enable private contributions in your profile settings. [**Learn how in GitHub's docs**](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements#changing-the-visibility-of-your-private-contributions).",
      },
      {
        id: "devices",
        question: "Does the project support every phone?",
        answer:
          "Not yet. Support for new iPhone and Android models is added continuously, with the goal of covering as many devices as possible. If you can't find your phone, open an issue on [**GitHub**](https://github.com/matheusaudibert/thegitcalendar) with its screen resolution, or ask for it to be added.",
      },
      {
        id: "how",
        question: "How does this project work?",
        answer:
          "The project is built on an [**API**](https://github.com/matheusaudibert/thegitcalendar) that generates an image sized for your phone's screen, showing your GitHub contribution graph. An automation on your phone sends a `GET` request to that API every day and sets the image it returns as your wallpaper. On iPhone, this runs natively through the [Shortcuts](https://apps.apple.com/app/id915249334) app's automations. Android has no built-in equivalent, so the automation is created with the [**MacroDroid**](https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid) app.",
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
      usernamePlaceholder: "your-github-username",
      usernameRequired: "Enter your GitHub username to continue.",
      usernameNotFound:
        "We couldn't find a GitHub user with that username. Double-check the spelling and try again.",
      usernameMalformed:
        "GitHub usernames only contain letters, numbers and hyphens, up to 39 characters.",
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
    title: "Calendário Git",
    subtitle: "Mostre suas contribuições do GitHub na tela do seu celular.",
    builtBy: "Feito por",
    metaDescription:
      "Transforme seu gráfico de contribuições do GitHub em um wallpaper que se atualiza todo dia.",
    installIos: "Instalar no iOS",
    installAndroid: "Instalar no Android",
    starProject: "Dê uma estrela no projeto",
    wallpaperAlt: "Gráfico de contribuições do GitHub como wallpaper de iPhone",
    howTitle: "Como funciona",
    howSteps: {
      copy: {
        title: "Copie a URL do seu wallpaper",
        description:
          "Escolha as cores e o estilo, e copie o link da sua imagem personalizada.",
      },
      automate: {
        title: "Crie a automação",
        description:
          "Configure uma automação no Atalhos do iPhone ou uma macro no MacroDroid do Android. Leva só alguns minutos.",
      },
      daily: {
        title: "Atualizado todo dia",
        description:
          "Seu wallpaper se atualiza sozinho com suas contribuições mais recentes, sem você precisar fazer mais nada.",
      },
    },
    aboutTitle: "Sobre o projeto",
    visitsLabel: "Visitas",
    notFoundTitle: "Página não encontrada",
    notFoundDescription:
      "A página que você procura não existe ou foi movida.",
    notFoundHome: "Voltar ao início",
    aboutParagraphs: [
      "Olá, eu sou **Matheus Audibert**, um engenheiro de software. Criei este projeto em algumas horas, durante uma madrugada produtiva. A ideia era simples: **eu queria ver meu gráfico de contribuições do GitHub todos os dias no meu wallpaper**. O que eu não esperava era que o projeto **viralizasse**, e muito menos descobrir que vários outros devs também queriam exatamente a mesma coisa.",
      "É muito legal ver algo que começou como uma ideia pessoal sendo usado por tanta gente. **Obrigado** a todos que estão usando, compartilhando e apoiando o projeto!"
    ],
    testimonialQuotes: {
      samuelrizzon: "Wallpaper que atualiza os commits diariamente 🤯🤯🤯",
      devcelio:
        "E esse wallpaper que o mano @audibertdev lançou, ficou muito lindo",
    },
    faqTitle: "FAQ",
    faq: [
      {
        id: "customize",
        question: "Posso personalizar o wallpaper?",
        answer:
          "Sim. Você pode escolher a cor e o formato dos quadrados de contribuição, além da cor de fundo da imagem.",
      },
      {
        id: "private",
        question: "O wallpaper inclui contribuições privadas?",
        answer:
          "Somente se o seu perfil do GitHub as exibir. Por padrão, o GitHub mostra apenas as contribuições públicas. Para incluir as privadas, ative a exibição de contribuições privadas nas configurações do seu perfil. [**Veja como na documentação do GitHub**](https://docs.github.com/en/account-and-profile/how-tos/contribution-settings/manage-visibility-settings-for-private-contributions-and-achievements#changing-the-visibility-of-your-private-contributions).",
      },
      {
        id: "devices",
        question: "O projeto é compatível com todos os celulares?",
        answer:
          "Ainda não. O suporte a novos modelos de iPhone e Android é adicionado continuamente, com o objetivo de cobrir o maior número possível de aparelhos. Se o seu celular não estiver na lista, abra uma issue no [**GitHub**](https://github.com/matheusaudibert/thegitcalendar) informando a resolução da tela dele ou pedindo que ela seja adicionada.",
      },
      {
        id: "how",
        question: "Como o projeto funciona?",
        answer:
          "O projeto é baseado em uma [**API**](https://github.com/matheusaudibert/thegitcalendar) que gera uma imagem no tamanho da tela do seu celular, com o seu gráfico de contribuições do GitHub. Uma automação no celular faz uma requisição `GET` a essa API todos os dias e define a imagem retornada como plano de fundo. No iPhone, isso é feito de forma nativa pelas automações do app [Atalhos](https://apps.apple.com/app/id915249334). O Android não oferece um recurso equivalente, então a automação é criada com o app [**MacroDroid**](https://play.google.com/store/apps/details?id=com.arlosoft.macrodroid).",
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
      usernamePlaceholder: "seu-usuario-do-github",
      usernameRequired: "Digite seu usuário do GitHub para continuar.",
      usernameNotFound:
        "Não encontramos nenhum usuário do GitHub com esse nome. Confira a grafia e tente de novo.",
      usernameMalformed:
        "Usuários do GitHub só têm letras, números e hífens, com até 39 caracteres.",
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
