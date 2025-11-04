
// This file now uses the html2canvas library, which should be included in index.html
// The library is available globally as `html2canvas`.
declare const html2canvas: any;

/**
 * Renders an HTMLElement to a canvas using html2canvas and triggers a download.
 * @param element The HTMLElement to export.
 * @param format The desired image format.
 * @param fileName The base name for the downloaded file.
 * @param quality The resolution scale (e.g., 1 for 1x, 2 for 2x).
 * @param transparent Whether the background should be transparent (for PNGs).
 */
export const exportCanvas = async (element: HTMLElement, format: 'png' | 'jpeg', fileName: string, quality: number, transparent: boolean) => {
    try {
        const canvas = await html2canvas(element, {
            useCORS: true, 
            backgroundColor: transparent && format === 'png' ? null : window.getComputedStyle(element).backgroundColor,
            scale: quality,
            logging: false,
        });
        
        const dataUrl = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.92 : 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error exporting canvas with html2canvas:", error);
        throw error;
    }
};

/**
 * Creates a snapshot of an HTMLElement as an HTMLCanvasElement using html2canvas.
 * Used for features like the color picker.
 * @param element The HTMLElement to capture.
 * @returns A Promise that resolves with the captured HTMLCanvasElement.
 */
export const getCanvasSnapshot = async (element: HTMLElement): Promise<HTMLCanvasElement> => {
    try {
        const canvas = await html2canvas(element, {
            useCORS: true,
            backgroundColor: null,
            logging: false,
        });
        return canvas;
    } catch (error) {
        console.error("Error getting canvas snapshot with html2canvas:", error);
        throw error;
    }
}
