import Head from "next/head";

export const HeadLayout = () => {
  return (
    <Head>
      <title>Filmoji 🍿</title>
      <meta
        name="description"
        content="Filmoji ! Guess movies, tvshow or videogames by emojis"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
