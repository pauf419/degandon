import React, {useEffect, useRef} from "react";

export const useObserver = (ref: any, canLoad: boolean, deps: any[], isLoading: boolean, callback: () => void) => {
    const observer = useRef<any>(null);

    useEffect(() => {
        if(isLoading) return 
        if(observer.current) observer.current.disconnect();

        const cb = function(entries: any, observer: any) {
            if (entries[0].isIntersecting && canLoad) {
                callback()
            } 
        };

        try {
            observer.current = new IntersectionObserver(cb);
            observer.current.observe(ref.current)
        } catch(e) {
            
        }
    }, [isLoading, ...deps])
}