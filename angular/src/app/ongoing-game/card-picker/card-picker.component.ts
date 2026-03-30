import { Component, OnDestroy } from '@angular/core';
import { CardValue, Deck } from '../../model/deck';
import { Subscription } from 'rxjs';
import { CurrentGameService } from '../current-game.service';
import { UserInformationService } from '../../shared/user-info/user-information.service';
import { PickableCardComponent } from './card/pickable-card.component';
import { NgIf, NgFor } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
    selector: 'shpp-card-picker',
    templateUrl: './card-picker.component.html',
    standalone: true,
    imports: [NgIf, NgFor, PickableCardComponent]
})
export class CardPickerComponent implements OnDestroy {
  deck?: Deck
  selectedCard?: CardValue;
  isSpectator = false;
  isGameRevealed = false;

  private deckSubscription: Subscription;
  private newGameSubscription: Subscription;
  private spectatorSubscription: Subscription;
  private gameRevealedSubscription: Subscription;

  constructor(private currentGame: CurrentGameService,
              private userInfoService: UserInformationService) {
    this.deckSubscription = currentGame.deck$
    .subscribe((deck) => {
      this.deck = deck;
      this.selectedCard = undefined;
    });

    this.newGameSubscription = this.currentGame.newGame$
    .subscribe(() => this.selectedCard = undefined);

    this.spectatorSubscription = this.userInfoService.spectatorObservable()
    .subscribe((spectator: boolean) => {
      this.isSpectator = spectator;
      if (spectator) {
        this.selectedCard = undefined;
      }
    });

    this.gameRevealedSubscription = this.currentGame.revealed$
    .subscribe((revealed: boolean) => this.isGameRevealed = revealed);
  }

  selectCard(card: CardValue): void {
    if (this.isSpectator || this.isGameRevealed) {
      return;
    }
    if (this.selectedCard !== card) {
      this.selectedCard = card;
      this.currentGame.pickCard(card.value);
      const emojis = ['🃏', '🤔', '❓'];
      const shapes = emojis.map(e => (confetti as any).shapeFromText({ text: e, scalar: 2 }));
      confetti({
        disableForReducedMotion: true,
        particleCount: 60,
        spread: 70,
        origin: { y: 0.9 },
        shapes,
        scalar: 2
      });
    } else {
      this.selectedCard = undefined;
      this.currentGame.pickCard(null);
    }
  }

  ngOnDestroy(): void {
    this.deckSubscription.unsubscribe();
    this.newGameSubscription.unsubscribe();
    this.spectatorSubscription.unsubscribe();
  }

}
