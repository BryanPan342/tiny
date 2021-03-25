export const redirectQuery = (link: string) => `{
  redirectCollection(where: {redirectPath: "${link}"}) {
    items {
      url
    }
  }
}`