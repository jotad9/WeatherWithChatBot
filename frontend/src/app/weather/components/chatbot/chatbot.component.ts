import { Component } from '@angular/core';
import { VoiceglowService } from '../../../services/VoiceglowService.service';
@Component({
  selector: 'outfit',
  standalone: true,
  imports: [],
  templateUrl: './outfit.component.html',
  styleUrl: './outfit.component.css'
})
export class ChatbotComponent {
  constructor(private voiceglowService: VoiceglowService) { }

  ngOnInit(): void {
    this.voiceglowService.loadVoiceglow();
  }
}
