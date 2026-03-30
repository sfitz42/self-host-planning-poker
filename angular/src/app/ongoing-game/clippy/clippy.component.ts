import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { CurrentGameService } from '../current-game.service';
import { UserInformationService } from '../../shared/user-info/user-information.service';
import { GameState } from '../../model/events';

@Component({
  selector: 'shpp-clippy',
  standalone: true,
  imports: [NgIf],
  styleUrls: ['./clippy.component.scss'],
  template: `
    <div class="d-flex flex-column align-items-center m-2 m-sm-5 position-relative" *ngIf="message">
      <div class="speech-bubble">{{ message }}</div>
      <div class="card-border card-disabled">
        <img src="assets/clippy.png" alt="Clippy" style="width: 60px; transform: rotate(180deg)" />
      </div>
      <div class="player-name mt-1">Clippy</div>
    </div>
  `
})
export class ClippyComponent implements OnInit, OnDestroy {
  message: string | null = null;

  private revealedSubscription?: Subscription;
  private newGameSubscription?: Subscription;
  private stateSubscription?: Subscription;

  private pickMessages = [
    "Are you sure about that one? 🤔",
    "Interesting choice...",
    "Bold move! 🎯",
    "I see you've played this game before.",
    "Have you considered a different number?",
  ];
  private pickIndex = 0;

  constructor(
    private currentGame: CurrentGameService,
    private userInfo: UserInformationService
  ) {}

  ngOnInit(): void {
    this.message = "It looks like you're planning a sprint! Would you like help with your estimates?";

    this.revealedSubscription = this.currentGame.revealed$.pipe(
      startWith(false),
      pairwise()
    ).subscribe(([prev, curr]) => {
      if (!prev && curr) {
        this.currentGame.state$.subscribe(state => this.onReveal(state)).unsubscribe();
      }
    });

    this.newGameSubscription = this.currentGame.newGame$.subscribe(() => {
      this.message = "Ready for the next story? I'm here if you need me!";
    });

    this.stateSubscription = this.currentGame.state$.pipe(
      startWith({} as GameState),
      pairwise()
    ).subscribe(([prev, curr]) => {
      const playerId = this.userInfo.getPlayerId();
      if (!playerId) return;
      if (!prev[playerId]?.hasPicked && curr[playerId]?.hasPicked) {
        this.message = this.pickMessages[this.pickIndex % this.pickMessages.length];
        this.pickIndex++;
      }
    });
  }

  private onReveal(state: GameState): void {
    const hands = Object.values(state)
      .filter(p => !p.spectator && p.hand !== undefined)
      .map(p => p.hand as number);

    if (hands.length < 2) {
      this.message = "Cards revealed! How did that go? 🃏";
      return;
    }

    const spread = Math.max(...hands) - Math.min(...hands);
    if (spread === 0) {
      this.message = "Everyone agreed! Great teamwork! 🎉";
    } else if (spread >= 5) {
      this.message = "It looks like there's quite a disagreement here! Would you like help resolving it?";
    } else {
      this.message = "Some different opinions there! Want help finding a middle ground?";
    }
  }

  ngOnDestroy(): void {
    this.revealedSubscription?.unsubscribe();
    this.newGameSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
  }
}
