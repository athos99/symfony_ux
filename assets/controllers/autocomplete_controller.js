import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['input', 'results'];
    static values = { url: String };

    connect() {
        this.abortController = null;
        this.timer = null;
    }

    disconnect() {
        clearTimeout(this.timer);
        this.abortController?.abort();
    }

    search() {
        clearTimeout(this.timer);

        const query = this.inputTarget.value.trim();

        if (query.length < 2) {
            this.resultsTarget.replaceChildren();
            return;
        }

        this.timer = setTimeout(() => this.load(query), 250);
    }

    async load(query) {
        this.abortController?.abort();
        this.abortController = new AbortController();

        const url = new URL(this.urlValue, window.location.origin);
        url.searchParams.set('q', query);

        try {
            const response = await fetch(url, {
                headers: { Accept: 'application/json' },
                signal: this.abortController.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const items = await response.json();
            this.render(items);
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
            }
        }
    }

    render(items) {
        this.resultsTarget.replaceChildren();

        for (const item of items) {
            const li = document.createElement('li');
            li.textContent = item.label;
            this.resultsTarget.append(li);
        }
    }
}
