/// <reference path="node_modules/tns-platform-declarations/android.d.ts" />
/// <reference path="node_modules/tns-platform-declarations/ios.d.ts" />

declare module com {
	export module rd {
        export class PageIndicatorView extends android.view.View {
            constructor(context: android.content.Context);
            constructor(context: android.content.Context, attrs: android.util.AttributeSet);
            
        }
    }
}