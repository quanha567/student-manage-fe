interface ProgressProps {
    className?: string
    percent?: number
}

export const Progress = ({ className, percent = 0 }: ProgressProps) => {
    return (
        <div className={`flex w-full items-center ${className ?? ''}`}>
            <div className="relative mr-2 h-[6px] flex-1 overflow-hidden rounded bg-[#f0f0f0]">
                <div
                    className="rounded bg-gradient-to-r from-[#FFD200] to-[#ff9900] transition-all duration-[15ms]"
                    style={{
                        height: 6,
                        width: `${String(percent)}%`,
                    }}
                ></div>
            </div>
            <span className="text-xs text-zinc-400">
                {Math.min(percent, 100)}%
            </span>
        </div>
    )
}
