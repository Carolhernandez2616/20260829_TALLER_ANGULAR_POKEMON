import { Directive, ElementRef, HostListener,inject ,input } from '@angular/core';

@Directive({
  selector: '[appResaltarTarjeta]',
  standalone: true
})
export class ResaltarTarjeta {
  private el = inject(ElementRef);
  colorBorde = input<string>('#FFFF00');
  
  @HostListener('mouseenter') onMouseEnter() {
    this.aplicarEfecto(`3px solid ${this.colorBorde()}`, 'scale(1.03)');
}

  @HostListener('mouseleave') onMouseLeave() {
    this.aplicarEfecto('none', 'scale(1)');
}

private aplicarEfecto(contorno: string, transformacion: string) {
    this.el.nativeElement.style.outline = contorno;
    this.el.nativeElement.style.outlineOffset = '2px';
    this.el.nativeElement.style.transform = transformacion;
    this.el.nativeElement.style.transition = 'all 0.3s ease-in-out';
  }
}