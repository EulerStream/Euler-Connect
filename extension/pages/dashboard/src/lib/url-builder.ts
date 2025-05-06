class _UrlBuilder {
  private readonly url: URL;
  private readonly isPath: boolean;

  constructor(url: string) {
    this.isPath = url.startsWith("/");
    this.url = this.isPath ? new URL(url, "http://dummy-url") : new URL(url);
  }

  build(): string {
    if (this.isPath) {
      return this.url.pathname;
    } else {
      return this.url.toString();
    }
  }

  add(key: string, value: string): _UrlBuilder {
    this.url.searchParams.append(key, value);
    return this;
  }
}

export function URLBuilder(url: string): _UrlBuilder {
  return new _UrlBuilder(url);
}

export function randomNonUniqueId() {
  return `id_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
}
