import Head from "next/head";

export const HeadLayout = (
  { title }: { title?: string } = { title: "Filmoji 🍿" }
) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="Filmoji ! Guess movies, tvshow or videogames by emojis"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
