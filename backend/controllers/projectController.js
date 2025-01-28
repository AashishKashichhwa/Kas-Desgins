 // server/controllers/projectController.js
 const Project = require('../models/Project');

  exports.getProjects = async (req, res) => {
     try {
         const projects = await Project.find();
          res.json(projects);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
   };
 
  exports.addProject = async (req, res) => {
        const project = new Project(req.body);
        try {
            const newProject = await project.save();
             res.status(201).json(newProject);
          } catch (error) {
              res.status(400).json({ message: error.message });
            }
     };

    exports.getProjectById = async (req, res) => {
        try{
            const project = await Project.findById(req.params.id);
            if(!project){
                return res.status(404).json({message: "Cannot find project"})
            }
            res.json(project);
        }
        catch(error){
            res.status(500).json({message: error.message});
        }
    }


    exports.updateProjectById = async(req, res) =>{
        try{
             const project = await Project.findById(req.params.id);
             if(!project){
                 return res.status(404).json({message: "cannot find the project"})
             }
             const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {new:true});
             res.json(updatedProject);
        }
        catch(error){
             res.status(500).json({message: error.message});
        }
    }


  exports.deleteProjectById = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
     if(!project){
         return res.status(404).json({message: "cannot find the project"});
     }
      await Project.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted Project' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
 