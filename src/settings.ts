import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

export class RankSettings extends FormattingSettingsCard{
    public display = new formattingSettings.ToggleSwitch({
        name: "show_ranking",
        displayName: "Display",
        value: true,
    });

    public name: string = "RankSettings";
    public displayName: string = "Rank Settings";
    public slices: FormattingSettingsSlice[] = [this.display]
}

export class AggRowSettings extends FormattingSettingsCard{
    public display = new formattingSettings.ToggleSwitch({
        name: "show_agg_row",
        displayName: "Display",
        value: true,
    });

    public name: string = "AggRowSettings";
    public displayName: string = "Aggregation Settings";
    public slices: FormattingSettingsSlice[] = [this.display]
}

export class VisualSettings extends FormattingSettingsModel {
    public RankSettings: RankSettings = new RankSettings();
    public AggRowSettings: AggRowSettings = new AggRowSettings();
    public cards: FormattingSettingsCard[] = [this.RankSettings, this.AggRowSettings];
}