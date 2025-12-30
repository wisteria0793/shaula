# ベースイメージをNode.jsの最新安定版に指定
FROM node:24-slim

# コンテナ内の作業ディレクトリを作成・指定
WORKDIR /app

# 依存関係の定義ファイルを先にコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# フロントエンドのソースコードをコピー
COPY . .

# アプリケーションを公開するポートを指定
EXPOSE 5173

# デフォルトのコンテナ起動コマンドを指定
CMD ["npm", "run", "dev", "--", "--host"]