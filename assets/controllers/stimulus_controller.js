import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static values = {
        text: { type: String, default: 'bonjour' },
        delay: { type: Number, default: 150 },
    };

    static targets = ['output', 'delayInput'];

    connect() {
        this.visibleText = '';
        this.letterIndex = 0;
        this.timer = null;
        this.play();
    }

    disconnect() {
        this.pause();
    }

    play() {
        this.pause();
        this.visibleText = '';
        this.letterIndex = 0;
        this.render();
        this.tick();
    }

    pause() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    tick() {
        if (this.letterIndex >= this.textValue.length) {
            this.timer = null;
            return;
        }

        this.visibleText += this.textValue.charAt(this.letterIndex);
        this.letterIndex += 1;
        this.render();

        this.timer = setTimeout(() => this.tick(), this.delayValue);
    }

    updateDelay() {
        if (!this.hasDelayInputTarget) {
            return;
        }

        this.delayValue = Number(this.delayInputTarget.value);
        this.play();
    }

    render() {
        const target = this.hasOutputTarget ? this.outputTarget : this.element;
        target.textContent = this.visibleText;
    }
}