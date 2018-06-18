import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'rmx-spinner',
  styleUrl: 'rmx-spinner.scss'
})
export class RmxSpinner {
  @Prop()
  public active: boolean = false;

  @Prop()
  public backgroundColor: 'white' | 'primarySoft' = 'white';

  @Prop()
  public size: 'small' | 'medium' | 'large' = 'small';

  public hostData() {
    return {
      class: {
        [this.size]: true,
        [this.backgroundColor]: true,
        active: this.active
      }
    };
  }

  public render(): JSX.Element {
    return (
      <div class="spinnerWrapper">
        <div class="rotator">
          <div class="innerSpin" />
          <div class="innerSpin" />
        </div>
      </div>
    );
  }
}
