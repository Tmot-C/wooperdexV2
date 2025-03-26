import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dex-ai',
  standalone: false,
  templateUrl: './dex-ai.component.html',
  styleUrl: './dex-ai.component.scss'
})
export class DexAIComponent {
  constructor(
    public dialogRef: MatDialogRef<DexAIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { analysisText: string }
  ) {}
}