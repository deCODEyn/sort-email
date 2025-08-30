export type Category = 'Produtivo' | 'Improdutivo';

export type ApiResponse = {
  category: Category;
  reply: string;
  tokens_used?: number | null;
  model?: string | null;
};
