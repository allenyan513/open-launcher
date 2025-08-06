import {Loader2} from 'lucide-react';

export function LoadingText(props: {
  isLoading: boolean
  loadingText: string
  normalText: string
}) {
  return (
    <span className="flex items-center justify-center gap-1">
      {props.isLoading &&
        <Loader2 className="h-4 w-4 animate-spin"/>
      }
      {props.isLoading ? props.loadingText : props.normalText}
    </span>
  );
}
