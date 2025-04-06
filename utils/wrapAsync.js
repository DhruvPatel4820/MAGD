module.exports= (funct)=>{
    return (req,res,next)=>{
        funct(req,res,next).catch(err=>next(err))
    }
}