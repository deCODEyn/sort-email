export type Category = 'Produtivo' | 'Improdutivo';

export type ApiResponse = {
  category: Category;
  suggestedResponse: string;
};
