export const redirectQuery = (link: string | string[]): string => `{
  redirectCollection(where: {redirectPath: "${link}"}) {
    items {
      url
    }
  }
}`;