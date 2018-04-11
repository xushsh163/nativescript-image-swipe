import { Component, OnInit } from "@angular/core";
import { PageChangeEventData } from "nativescript-image-swipe";

@Component({
    selector: "is-demo",
    moduleId: module.id,
    templateUrl: "./imageswipe.component.html",
})
export class ImageSwipeComponent implements OnInit {
    public items: any[] = [];
    public pageNumber: number = 3;

    ngOnInit(): void {
        this.items.push({ imageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523467796955&di=c4a36367e18f657621fca613899ad5ca&imgtype=0&src=http%3A%2F%2Fc.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F9358d109b3de9c822bb66df56081800a18d843fd.jpg" });
        this.items.push({ imageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523467796955&di=71695f855c5e1ea528a8c8ebb1cdaa84&imgtype=0&src=http%3A%2F%2Ff.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Faa18972bd40735fa13899ac392510fb30f24084b.jpg" });
        this.items.push({ imageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523467797087&di=718dc9ef1033a733b900e331a8bb7a2c&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F902397dda144ad34e98003fedca20cf431ad8588.jpg" });
        this.items.push({ imageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523467842230&di=d1414840ab8338e57bafa260523de7f0&imgtype=0&src=http%3A%2F%2Fe.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F4a36acaf2edda3cc003e7d050de93901213f9239.jpg" });
        this.items.push({ imageUrl: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1523467796945&di=9f1aa5a72ffeb42edaa9c782af03734b&imgtype=0&src=http%3A%2F%2Fa.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2Ff7246b600c3387441b8454035d0fd9f9d72aa008.jpg" });
    }

    public tapped() {
        console.log("tapped");
    }

    public pageChanged(e: PageChangeEventData) {
        console.log(`Page changed to ${e.page}.`);
    }
}
