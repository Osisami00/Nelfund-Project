"""
agent.py
LangGraph agent implementation
"""
from typing import Literal
from langgraph.graph import START, END, StateGraph, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode
from langchain_core.messages import AIMessage
from retriever import retrieve_nelfund_info
from llm import SYSTEM_PROMPT


def create_agent(llm):
    """
    Create and compile the LangGraph agent
    
    Args:
        llm: Initialized LLM with tools bound
        
    Returns:
        Compiled agent with memory
    """
    print("\n🧠 Building intelligent agent...")
    
    if llm is None:
        print("❌ Cannot create agent: LLM not initialized")
        return None
    
    # Bind tools
    tools = [retrieve_nelfund_info]
    llm_with_tools = llm.bind_tools(tools)
    
    def assistant_node(state: MessagesState) -> dict:
        """Main assistant node - decides whether to retrieve"""
        messages = [SYSTEM_PROMPT] + state["messages"]
        response = llm_with_tools.invoke(messages)
        return {"messages": [response]}
    
    def should_retrieve(state: MessagesState) -> Literal["retrieve", "__end__"]:
        """Routing function - decide tool use"""
        last_message = state["messages"][-1]
        
        if hasattr(last_message, 'tool_calls') and last_message.tool_calls:
            return "retrieve"
        return "__end__"
    
    # Build graph
    builder = StateGraph(MessagesState)
    
    # Add nodes
    builder.add_node("assistant", assistant_node)
    builder.add_node("retrieve", ToolNode(tools))
    
    # Add edges
    builder.add_edge(START, "assistant")
    
    builder.add_conditional_edges(
        "assistant",
        should_retrieve,
        {
            "retrieve": "retrieve",
            "__end__": END
        }
    )
    
    builder.add_edge("retrieve", "assistant")
    
    # Add memory
    memory = MemorySaver()
    agent = builder.compile(checkpointer=memory)
    
    print("✅ Agent created with conversation memory")
    return agent


