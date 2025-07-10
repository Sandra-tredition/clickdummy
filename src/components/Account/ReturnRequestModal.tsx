import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ReturnRequestModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      // Clear any existing content
      containerRef.current.innerHTML = "";

      // Create the div for the Zoho form
      const formDiv = document.createElement("div");
      formDiv.id = "zf_div_7yfqewvfO-xUNtT-C9Jy8c-JBKhlgrquP15T-m3TX3Q";
      containerRef.current.appendChild(formDiv);

      // Add a small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        // Execute the Zoho form script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.innerHTML = `
          (function() {
            try{
              var f = document.createElement("iframe");
              
              var ifrmSrc = 'https://forms.zohopublic.eu/tredition/form/Rcksendungtreditioncom/formperma/7yfqewvfO-xUNtT-C9Jy8c-JBKhlgrquP15T-m3TX3Q?zf_rszfm=1&zf_enablecamera=true';
              
              try{
                if ( typeof ZFAdvLead != "undefined" && typeof zfutm_zfAdvLead != "undefined" ) {
                  for( var prmIdx = 0 ; prmIdx < ZFAdvLead.utmPNameArr.length ; prmIdx ++ ) {
                      var utmPm = ZFAdvLead.utmPNameArr[ prmIdx ];
                      utmPm = ( ZFAdvLead.isSameDomian && ( ZFAdvLead.utmcustPNameArr.indexOf(utmPm) == -1 ) ) ? "zf_" + utmPm : utmPm;
                      var utmVal = zfutm_zfAdvLead.zfautm_gC_enc( ZFAdvLead.utmPNameArr[ prmIdx ] );
                      if ( typeof utmVal !== "undefined" ) {
                        if ( utmVal != "" ) {
                          if(ifrmSrc.indexOf('?') > 0){
                               ifrmSrc = ifrmSrc+'&'+utmPm+'='+utmVal;
                          }else{
                              ifrmSrc = ifrmSrc+'?'+utmPm+'='+utmVal;
                          }
                        }
                      }
                  }
                }
                if ( typeof ZFLead !== "undefined" && typeof zfutm_zfLead !== "undefined" ) {
                  for( var prmIdx = 0 ; prmIdx < ZFLead.utmPNameArr.length ; prmIdx ++ ) {
                    var utmPm = ZFLead.utmPNameArr[ prmIdx ];
                    var utmVal = zfutm_zfLead.zfutm_gC_enc( ZFLead.utmPNameArr[ prmIdx ] );
                    if ( typeof utmVal !== "undefined" ) {
                      if ( utmVal != "" ){
                        if(ifrmSrc.indexOf('?') > 0){
                          ifrmSrc = ifrmSrc+'&'+utmPm+'='+utmVal;
                        }else{
                          ifrmSrc = ifrmSrc+'?'+utmPm+'='+utmVal;
                        }
                      }
                    }
                  }
                }
              }catch(e){}
              
              f.src = ifrmSrc;
              f.style.border="none";
              f.style.height="600px";
              f.style.width="100%";
              f.style.transition="all 0.5s ease";
              f.setAttribute("aria-label", 'Reklamation');
              f.setAttribute("allow","camera;");
              var d = document.getElementById("zf_div_7yfqewvfO-xUNtT-C9Jy8c-JBKhlgrquP15T-m3TX3Q");
              if (d) {
                d.appendChild(f);
              }
              
              window.addEventListener('message', function (event){
                var evntData = event.data;
                if( evntData && evntData.constructor == String ){
                  var zf_ifrm_data = evntData.split("|");
                  if ( zf_ifrm_data.length == 2 || zf_ifrm_data.length == 3 ) {
                    var zf_perma = zf_ifrm_data[0];
                    var zf_ifrm_ht_nw = ( parseInt(zf_ifrm_data[1], 10) + 15 ) + "px";
                    var iframe = document.getElementById("zf_div_7yfqewvfO-xUNtT-C9Jy8c-JBKhlgrquP15T-m3TX3Q").getElementsByTagName("iframe")[0];
                    if ( iframe && (iframe.src).indexOf('formperma') > 0 && (iframe.src).indexOf(zf_perma) > 0 ) {
                      var prevIframeHeight = iframe.style.height;
                      var zf_tout = false;
                      if( zf_ifrm_data.length == 3 ) {
                          iframe.scrollIntoView();
                          zf_tout = true;
                      }

                      if ( prevIframeHeight != zf_ifrm_ht_nw ) {
                        if( zf_tout ) {
                            setTimeout(function(){
                                iframe.style.height = zf_ifrm_ht_nw;
                            },500);
                        } else {
                            iframe.style.height = zf_ifrm_ht_nw;
                        }
                      }
                    }
                  }
                }
              }, false);
            }catch(e){
              console.error('Zoho form loading error:', e);
            }
          })();
        `;

        document.head.appendChild(script);
      }, 100);

      // Cleanup function
      return () => {
        clearTimeout(timer);
        const scripts = document.head.querySelectorAll("script");
        scripts.forEach((script) => {
          if (
            script.innerHTML.includes(
              "zf_div_7yfqewvfO-xUNtT-C9Jy8c-JBKhlgrquP15T-m3TX3Q",
            )
          ) {
            document.head.removeChild(script);
          }
        });
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Bestellung reklamieren</DialogTitle>
          <DialogDescription>
            Fülle das folgende Formular aus, um eine Reklamation für deine
            Bestellung einzureichen.
          </DialogDescription>
        </DialogHeader>
        <div ref={containerRef} className="w-full h-[600px] overflow-auto" />
      </DialogContent>
    </Dialog>
  );
};

export default ReturnRequestModal;
