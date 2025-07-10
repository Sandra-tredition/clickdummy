import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentTab from "./ContentTab";
import CoverTab from "./CoverTab";
import PricingTab from "./PricingTab";
import { FileTextIcon, BookIcon, EuroIcon } from "lucide-react";

interface EditionTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  contentUploaded: boolean;
  coverUploaded: boolean;
  edition: any;
  selectedFormat: string;
  selectedPaperType: string;
  selectedCoverFinish: string;
  selectedSpineType: string;
  totalPages: number;
  colorPages: number[];
  contentFile: string;
  coverFile: string;
  customWidth: string;
  customHeight: string;
  customFormatError: string;
  setCustomWidth: (width: string) => void;
  setCustomHeight: (height: string) => void;
  validateCustomFormat: () => boolean;
  handleContentUpload: () => void;
  handleCoverUpload: () => void;
  setContentUploaded: (uploaded: boolean) => void;
  setContentFile: (file: string) => void;
  setTotalPages: (pages: number) => void;
  setColorPages: (pages: number[]) => void;
  setCoverUploaded: (uploaded: boolean) => void;
  setCoverFile: (file: string) => void;
  toggleColorPage: (pageNumber: number) => void;
  formatError: string;
  pages: { page: number; title: string }[];
  enableSampleReading: boolean;
  setEnableSampleReading: (enable: boolean) => void;
  priceImpact: {
    paperType: number;
    coverFinish: number;
    spineType: number;
    colorPages: number;
    format: number;
  };
  minimumPrice: number;
  sellingPrice: number;
  setSellingPrice: (price: number) => void;
  authorCommission: number;
  calculateCommission: () => number;
}

const EditionTabs: React.FC<EditionTabsProps> = ({
  activeTab,
  setActiveTab,
  contentUploaded,
  coverUploaded,
  edition,
  selectedFormat,
  selectedPaperType,
  selectedCoverFinish,
  selectedSpineType,
  totalPages,
  colorPages,
  contentFile,
  coverFile,
  customWidth,
  customHeight,
  customFormatError,
  setCustomWidth,
  setCustomHeight,
  validateCustomFormat,
  handleContentUpload,
  handleCoverUpload,
  setContentUploaded,
  setContentFile,
  setTotalPages,
  setColorPages,
  setCoverUploaded,
  setCoverFile,
  toggleColorPage,
  formatError,
  pages,
  enableSampleReading,
  setEnableSampleReading,
  priceImpact,
  minimumPrice,
  sellingPrice,
  setSellingPrice,
  authorCommission,
  calculateCommission,
}) => {
  return (
    <div className="border-b border-gray-200 pb-4 mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger
            value="print-properties"
            className="flex items-center gap-2"
          >
            <FileTextIcon className="h-4 w-4" />
            Inhalt
          </TabsTrigger>
          <TabsTrigger value="cover" className="flex items-center gap-2">
            <BookIcon className="h-4 w-4" />
            Cover
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <EuroIcon className="h-4 w-4" />
            Preis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="print-properties" className="space-y-6">
          <ContentTab
            contentUploaded={contentUploaded}
            selectedFormat={selectedFormat}
            selectedPaperType={selectedPaperType}
            selectedCoverFinish={selectedCoverFinish}
            selectedSpineType={selectedSpineType}
            customWidth={customWidth}
            customHeight={customHeight}
            customFormatError={customFormatError}
            setCustomWidth={setCustomWidth}
            setCustomHeight={setCustomHeight}
            validateCustomFormat={validateCustomFormat}
            handleContentUpload={handleContentUpload}
            setContentUploaded={setContentUploaded}
            setContentFile={setContentFile}
            setTotalPages={setTotalPages}
            setColorPages={setColorPages}
            formatError={formatError}
            contentFile={contentFile}
            totalPages={totalPages}
            priceImpact={priceImpact}
            minimumPrice={minimumPrice}
            enableSampleReading={enableSampleReading}
            setEnableSampleReading={setEnableSampleReading}
          />
        </TabsContent>

        <TabsContent value="cover" className="space-y-6">
          <CoverTab
            coverUploaded={coverUploaded}
            coverFile={coverFile}
            handleCoverUpload={handleCoverUpload}
            setCoverUploaded={setCoverUploaded}
            setCoverFile={setCoverFile}
          />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <PricingTab
            contentUploaded={contentUploaded}
            minimumPrice={minimumPrice}
            sellingPrice={sellingPrice}
            setSellingPrice={setSellingPrice}
            authorCommission={authorCommission}
            calculateCommission={calculateCommission}
            totalPages={totalPages}
            priceImpact={priceImpact}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditionTabs;
