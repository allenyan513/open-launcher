'use client'
import {BsCaretUp, BsCaretUpFill} from 'react-icons/bs';
import {cn} from "@repo/ui/lib/utils";
import {api, UnauthorizedError} from '@repo/shared';
import {useState} from 'react';
import {IconCaretUp, IconCaretUpFilled} from '@tabler/icons-react';
import {redirect} from "next/navigation";

export function ProductVoteButtonV2(props: {
  productId: string;
  voteCount: number;
  isVoted: boolean;
  className?: string;
}) {
  const {productId, isVoted: defaultIsVoted, voteCount: defaultVoteCount, className} = props;
  const [voteCount, setVoteCount] = useState<number>(defaultVoteCount);
  const [isVoted, setIsVoted] = useState<boolean>(defaultIsVoted);

  const onClickVote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isVoted) {
      //当前状态为已投票，取消投票
      api.products.unvote(productId)
        .then(() => {
          setVoteCount(defaultIsVoted ? defaultVoteCount - 1 : defaultVoteCount);
          setIsVoted(false);
        })
        .catch((error) => {
          if (error instanceof UnauthorizedError) {
            redirect('/auth/signin')
          }
          console.error('Error unvoting product:', error);
        });
    } else {
      //当前状态为未投票，进行投票
      api.products.vote(productId || '')
        .then(() => {
          setVoteCount(defaultIsVoted ? defaultVoteCount : defaultVoteCount + 1);
          setIsVoted(true);
        })
        .catch((error) => {
          if (error instanceof UnauthorizedError) {
            redirect('/auth/signin')
          }
          console.error('Error voting product:', error);
        });
    }
  }

  return (
    <button
      id={'upvote-button'}
      className={cn('flex flex-row rounded-full justify-center items-center border cursor-pointer transition-colors text-lg font-medium',
        isVoted ? 'bg-white text-red-400 border-red-400 hover:bg-red-100' : 'bg-red-400 text-white hover:bg-red-500 border-red-400',
        className,
      )}
      onClick={onClickVote}
    >
      {isVoted ? <IconCaretUpFilled className="text-red-400"/> : <IconCaretUp className=""/>}
      {isVoted ? 'Upvoted' : 'Upvote'}
      {' • '}
      {voteCount} votes
    </button>
  );
}
