import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VoiceglowService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  public loadVoiceglow(): void {
    // Configuración de Voiceglow
    const tempWindow: any = window;
    tempWindow['VG_CONFIG'] = {
      ID: 'qjr2xsyav1ckys7s',
      region: 'eu', // 'eu' o 'na'
      render: 'popup', // popup o full-width
      stylesheets: [
        'https://storage.googleapis.com/voiceglow-cdn/vg_dev_build/styles.css',

      ],
    };


    const vgScript = this.renderer.createElement('script');
    this.renderer.setAttribute(
      vgScript,
      'src',
      'https://storage.googleapis.com/voiceglow-cdn/vg_dev_build/vg_bundle.js'
    );
    this.renderer.appendChild(document.body, vgScript);
  }
}
