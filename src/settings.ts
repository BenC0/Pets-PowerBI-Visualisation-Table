import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class BasicSettings extends FormattingSettingsCard{
    public ranking = new formattingSettings.ToggleSwitch({
        name: "show_ranking",
        displayName: "Display Ranks",
        value: true,
    });

    public show_totals = new formattingSettings.ToggleSwitch({
        name: "show_totals",
        displayName: "Display Total Row",
        value: true,
    });

    public name: string = "BasicSettings";
    public displayName: string = "Basic Settings";
    public slices: FormattingSettingsSlice[] = [this.ranking, this.show_totals]
}

export class VisualSettings extends FormattingSettingsModel {
    public BasicSettings: BasicSettings = new BasicSettings();
    public cards: FormattingSettingsCard[] = [this.BasicSettings];
}