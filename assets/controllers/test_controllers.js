import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
        this.element.textContent = 'assets/controllers/test_controller.js';
    }
}
console.log('This log comes from assets/controllers/test_controllers.js');