
# Pythonの公式イメージをベースに使用
FROM python:3.11-slim

# 環境変数を設定
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 作業ディレクトリを作成
WORKDIR /app

# 依存関係のインストール
RUN apt-get update && apt-get install -y \
    # PostgreSQL接続に必要な開発ファイル
    build-essential \
    libpq-dev \                             
    && rm -rf /var/lib/apt/lists/*

# Pythonライブラリのインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# カレントディレクトリのファイルをコンテナにコピー
COPY . .

# アプリケーションがリッスンするポートをドキュメント化
EXPOSE 8000

# サーバー起動コマンド
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

