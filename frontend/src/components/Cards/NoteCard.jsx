import React from "react";
import moment from "moment";
import { Pin,Pencil,Trash2} from "lucide-react";


const NoteCard = ({title,date,content,tags,isPlanned,onEdit,onDelete,onPinNote}) => {
    return (
        <div className="border border-slate-300 rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h6 className="text-sm font-medium">{title}</h6>
                    <span className="text-xs text-slate-500">{moment(date).format("DD MMM YYYY")}</span>
                </div>
                <Pin className={`text-xl text-indigo-400 cursor-pointer ${isPlanned ? 'text-blue-400' : 'text-slate-500'}`} onClick={onPinNote}/>
            </div>
            <div className="text-xs text-slate-600" dangerouslySetInnerHTML={{ __html: content?.slice(0, 150) }}/>
            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500">{tags.map((item)=> `#${item} `)}</div>
                    <div className="flex item-center gap-2">
                        <Pencil className="text-xl text-slate-300 cursor-pointer hover:text-green-600"
                        onClick={onEdit}
                        />
                        <Trash2 className="text-xl text-slate-300 cursor-pointer hover:text-red-600"
                        onClick={onDelete}
                        />
                </div>
            </div>
        </div>

    )
}
export default NoteCard;