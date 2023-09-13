import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class BasicSettings extends FormattingSettingsCard{
    public ranking = new formattingSettings.ToggleSwitch({
        name: "show_ranking",
        displayName: "Display",
        value: true,
    });

    public name: string = "ranking";
    public displayName: string = "Ranking";
    public slices: FormattingSettingsSlice[] = [this.ranking]
}

export class VisualSettings extends FormattingSettingsModel {
    public BasicSettings: BasicSettings = new BasicSettings();
    public cards: FormattingSettingsCard[] = [this.BasicSettings];
}