import { DomSanitizer } from '@angular/platform-browser';
import { Pipe } from '@angular/core';

//Erstellt valides "sicheres" HTML

@Pipe({ name: 'safe-pipe' })
export class SafePipe {

    constructor(private sanitizer: DomSanitizer) {
        this.sanitizer = sanitizer;
    }

    transform(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
