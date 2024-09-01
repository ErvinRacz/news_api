export interface NewsSource {
  fetchNews(n: number): Promise<any>;
  searchByKeyword(keyword: string): Promise<any>;
  findByTitle(title: string): Promise<any>;
  findByAuthor(author: string): Promise<any>;
}
